import * as fs from 'fs';
import * as path from 'path';

export interface ProjectInfo {
  name: string;
  screenCount: number;
  screens: string[];
  hasLocalConfig: boolean;
}

export interface LocalConfigData {
  primaryColor?: string;
  secondaryColor?: string;
  primaryFont?: string;
  tasteStyle?: string;
  platform?: string;
  appBrief?: string;
}

export class ProjectManager {
  private rootPluginDir: string;

  constructor(workspacePath: string) {
    this.rootPluginDir = path.join(workspacePath, 'FigmaPlugin');
  }

  public getPluginDir(): string {
    return this.rootPluginDir;
  }

  /**
   * Scans workspace for all project folders in FigmaPlugin/
   */
  public listProjects(): ProjectInfo[] {
    if (!fs.existsSync(this.rootPluginDir)) return [];

    const entries = fs.readdirSync(this.rootPluginDir, { withFileTypes: true });
    const projects: ProjectInfo[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (['plugin', 'core', 'global', 'node_modules', '.git'].includes(entry.name)) continue;

      const projectDir = path.join(this.rootPluginDir, entry.name);
      const screensDir = path.join(projectDir, 'screens');
      const localDir = path.join(projectDir, 'local');

      let screens: string[] = [];
      if (fs.existsSync(screensDir) && fs.statSync(screensDir).isDirectory()) {
        screens = fs.readdirSync(screensDir).filter(f => f.endsWith('.js'));
      }

      projects.push({
        name: entry.name,
        screenCount: screens.length,
        screens,
        hasLocalConfig: fs.existsSync(localDir)
      });
    }

    return projects;
  }

  /**
   * Scaffold a new project (@newproject)
   */
  public scaffoldProject(projectName: string): boolean {
    const cleanName = projectName.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanName) return false;

    const projectDir = path.join(this.rootPluginDir, cleanName);
    const screensDir = path.join(projectDir, 'screens');
    const localDir = path.join(projectDir, 'local');
    const globalDir = path.join(this.rootPluginDir, 'global');

    if (!fs.existsSync(screensDir)) fs.mkdirSync(screensDir, { recursive: true });
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

    // Copy global defaults to local if global exists
    const filesToCopy = ['colors.md', 'fonts.md', 'taste.md', 'brief.md'];
    for (const file of filesToCopy) {
      const srcFile = path.join(globalDir, file);
      const destFile = path.join(localDir, file);
      if (fs.existsSync(srcFile) && !fs.existsSync(destFile)) {
        fs.copyFileSync(srcFile, destFile);
      }
    }

    return true;
  }

  /**
   * Read local configuration for a specific project
   */
  public readLocalConfig(projectName: string): LocalConfigData {
    const localDir = path.join(this.rootPluginDir, projectName, 'local');
    const config: LocalConfigData = {};

    if (!fs.existsSync(localDir)) return config;

    // Read colors.md
    const colorsFile = path.join(localDir, 'colors.md');
    if (fs.existsSync(colorsFile)) {
      const text = fs.readFileSync(colorsFile, 'utf8');
      const primaryMatch = text.match(/Primary(?: Brand)? Color:\s*(#[0-9A-Fa-f]{6})/i) || text.match(/#(?:[0-9A-Fa-f]{6})/);
      if (primaryMatch) config.primaryColor = primaryMatch[1] || primaryMatch[0];
      
      const secondaryMatch = text.match(/Secondary(?: Brand)? Color:\s*(#[0-9A-Fa-f]{6})/i);
      if (secondaryMatch) config.secondaryColor = secondaryMatch[1];
    }

    // Read fonts.md
    const fontsFile = path.join(localDir, 'fonts.md');
    if (fs.existsSync(fontsFile)) {
      const text = fs.readFileSync(fontsFile, 'utf8');
      const fontMatch = text.match(/(?:Primary Font Family|Default Font Family|Font Family):\s*([^\n\r]+)/i);
      if (fontMatch) config.primaryFont = fontMatch[1].trim();
    }

    // Read taste.md
    const tasteFile = path.join(localDir, 'taste.md');
    if (fs.existsSync(tasteFile)) {
      config.tasteStyle = fs.readFileSync(tasteFile, 'utf8');
    }

    // Read brief.md
    const briefFile = path.join(localDir, 'brief.md');
    if (fs.existsSync(briefFile)) {
      config.appBrief = fs.readFileSync(briefFile, 'utf8');
    }

    return config;
  }

  /**
   * Save local configuration edits back to markdown files
   */
  public saveLocalConfig(projectName: string, data: LocalConfigData): void {
    const localDir = path.join(this.rootPluginDir, projectName, 'local');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    // Update colors.md
    if (data.primaryColor) {
      const colorsPath = path.join(localDir, 'colors.md');
      let content = `# Local Color Tokens Overrides — ${projectName}\n\n`;
      content += `- Primary Color: ${data.primaryColor}\n`;
      if (data.secondaryColor) content += `- Secondary Color: ${data.secondaryColor}\n`;
      content += `\n\`\`\`javascript\nconst COLOR_PRIMARY = "${data.primaryColor}";\n\`\`\`\n`;
      fs.writeFileSync(colorsPath, content, 'utf8');
    }

    // Update fonts.md
    if (data.primaryFont) {
      const fontsPath = path.join(localDir, 'fonts.md');
      let content = `# Local Typography Scale — ${projectName}\n\n`;
      content += `- Primary Font Family: ${data.primaryFont}\n`;
      content += `- Scale (Even Numbers Only): 10, 12, 14, 16, 20, 24, 32\n`;
      fs.writeFileSync(fontsPath, content, 'utf8');
    }

    // Update taste.md
    if (data.tasteStyle !== undefined) {
      const tastePath = path.join(localDir, 'taste.md');
      fs.writeFileSync(tastePath, data.tasteStyle, 'utf8');
    }

    // Update brief.md
    if (data.appBrief !== undefined) {
      const briefPath = path.join(localDir, 'brief.md');
      fs.writeFileSync(briefPath, data.appBrief, 'utf8');
    }
  }
}
