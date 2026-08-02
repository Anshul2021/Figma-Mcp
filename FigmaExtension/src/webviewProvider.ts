import * as vscode from 'vscode';
import { ProjectManager } from './projectManager';
import * as http from 'http';

export class FigmaAiWebviewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _projectManager: ProjectManager
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Listen for incoming messages from the Sidebar Webview UI
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'load-initial':
          this.refreshAll();
          break;

        case 'create-project':
          if (data.name) {
            const success = this._projectManager.scaffoldProject(data.name);
            if (success) {
              vscode.window.showInformationMessage(`Scaffolded new project: FigmaPlugin/${data.name}/`);
              this.refreshAll(data.name);
            } else {
              vscode.window.showErrorMessage(`Failed to create project: ${data.name}`);
            }
          }
          break;

        case 'select-project':
          this.sendProjectDetails(data.name);
          break;

        case 'save-local-config':
          if (data.name && data.config) {
            this._projectManager.saveLocalConfig(data.name, data.config);
            vscode.window.showInformationMessage(`Saved local theme overrides for ${data.name}!`);
            this.sendProjectDetails(data.name);
          }
          break;

        case 'execute-screen':
          if (data.scriptPath) {
            this.triggerScreenExecution(data.scriptPath);
          }
          break;
      }
    });
  }

  /**
   * Refreshes the webview project list and health status
   */
  public refreshAll(selectedProjectName?: string) {
    if (!this._view) return;

    const projects = this._projectManager.listProjects();
    const activeProject = selectedProjectName || (projects.length > 0 ? projects[0].name : '');

    this._view.webview.postMessage({
      type: 'update-projects',
      projects,
      activeProject
    });

    if (activeProject) {
      this.sendProjectDetails(activeProject);
    }
  }

  /**
   * Sends local config & screens list for a selected project to Webview
   */
  public sendProjectDetails(projectName: string) {
    if (!this._view) return;

    const config = this._projectManager.readLocalConfig(projectName);
    const projects = this._projectManager.listProjects();
    const proj = projects.find(p => p.name === projectName);

    this._view.webview.postMessage({
      type: 'update-project-details',
      projectName,
      config,
      screens: proj ? proj.screens : []
    });
  }

  /**
   * Sends explicit execution trigger to bridge server (/api/run)
   */
  private triggerScreenExecution(scriptPath: string) {
    const postData = JSON.stringify({ filename: scriptPath });
    const req = http.request('http://localhost:3003/api/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res: http.IncomingMessage) => {
      let data = '';
      res.on('data', (chunk: Buffer | string) => data += chunk);
      res.on('end', () => {
        vscode.window.showInformationMessage(`Sent execution trigger to Figma canvas: ${scriptPath}`);
      });
    });

    req.on('error', (err: Error) => {
      vscode.window.showErrorMessage(`Bridge server unreachable: ${err.message}. Make sure 'node server.js' is running.`);
    });

    req.write(postData);
    req.end();
  }

  /**
   * Generates the sidebar HTML UI for Antigravity & VS Code
   */
  private _getHtmlForWebview(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    :root {
      --bg: var(--vscode-sideBar-background, #1e1e1e);
      --fg: var(--vscode-sideBar-foreground, #cccccc);
      --border: var(--vscode-sideBar-border, #333333);
      --input-bg: var(--vscode-input-background, #252526);
      --input-fg: var(--vscode-input-foreground, #cccccc);
      --input-border: var(--vscode-input-border, #3c3c3c);
      --btn-bg: var(--vscode-button-background, #0e639c);
      --btn-fg: var(--vscode-button-foreground, #ffffff);
      --btn-hover: var(--vscode-button-hoverBackground, #1177bb);
      --card-bg: var(--vscode-editor-background, #252526);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--vscode-font-family, system-ui, sans-serif);
      font-size: 12px;
      color: var(--fg);
      background: var(--bg);
      padding: 12px;
      user-select: none;
    }

    .section {
      margin-bottom: 16px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px;
    }

    .section-title {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--vscode-textPreformat-foreground, #3794ff);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .form-group {
      margin-bottom: 10px;
    }

    label {
      display: block;
      font-size: 10px;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--fg);
      opacity: 0.8;
    }

    input[type="text"], select, textarea {
      width: 100%;
      padding: 6px;
      background: var(--input-bg);
      color: var(--input-fg);
      border: 1px solid var(--input-border);
      border-radius: 4px;
      font-size: 11px;
      outline: none;
    }

    input[type="color"] {
      width: 100%;
      height: 28px;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 4px;
      cursor: pointer;
    }

    button {
      width: 100%;
      padding: 6px 12px;
      background: var(--btn-bg);
      color: var(--btn-fg);
      border: none;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    button:hover {
      background: var(--btn-hover);
    }

    .row {
      display: flex;
      gap: 8px;
    }

    .row > * {
      flex: 1;
    }

    .screen-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 4px;
      margin-bottom: 4px;
    }

    .screen-name {
      font-size: 11px;
      font-weight: 500;
    }

    .play-btn {
      width: 24px;
      height: 24px;
      padding: 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>

  <!-- HEADER & PROJECT SWITCHER -->
  <div class="section">
    <div class="section-title">
      <span>Project Workspace</span>
      <span id="screenCountBadge" style="font-size: 9px; opacity: 0.7;">0 Screens</span>
    </div>
    <div class="form-group">
      <label>Active Project</label>
      <select id="projectSelect"></select>
    </div>
    <div class="row">
      <input type="text" id="newProjectInput" placeholder="New project name..." />
      <button id="createProjectBtn" style="width: 70px;">Create</button>
    </div>
  </div>

  <!-- LOCAL THEME CONFIGURATOR (local/) -->
  <div class="section">
    <div class="section-title">
      <span>Local Theme Overrides</span>
      <span style="font-size: 9px; opacity: 0.7;">local/</span>
    </div>

    <div class="row form-group">
      <div>
        <label>Primary Color</label>
        <input type="color" id="primaryColor" value="#E23744" />
      </div>
      <div>
        <label>Secondary Color</label>
        <input type="color" id="secondaryColor" value="#111827" />
      </div>
    </div>

    <div class="form-group">
      <label>Primary Font Family</label>
      <select id="primaryFont">
        <option value="DM Sans">DM Sans (Default)</option>
        <option value="Poppins">Poppins</option>
        <option value="Inter">Inter</option>
        <option value="Roboto">Roboto</option>
        <option value="Outfit">Outfit</option>
      </select>
    </div>

    <div class="form-group">
      <label>App Brief / Target Specs (brief.md)</label>
      <textarea id="appBrief" rows="3" placeholder="Project specs & layout stack..."></textarea>
    </div>

    <button id="saveConfigBtn">Save Local Theme Settings</button>
  </div>

  <!-- SCREENS MANAGER -->
  <div class="section">
    <div class="section-title">
      <span>Generated Screens</span>
      <span id="screensBadge" style="font-size: 9px; opacity: 0.7;">screens/</span>
    </div>
    <div id="screensList">
      <div style="opacity: 0.6; text-align: center; padding: 12px;">No screens generated yet</div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    const projectSelect = document.getElementById('projectSelect');
    const newProjectInput = document.getElementById('newProjectInput');
    const createProjectBtn = document.getElementById('createProjectBtn');
    
    const primaryColor = document.getElementById('primaryColor');
    const secondaryColor = document.getElementById('secondaryColor');
    const primaryFont = document.getElementById('primaryFont');
    const appBrief = document.getElementById('appBrief');
    const saveConfigBtn = document.getElementById('saveConfigBtn');

    const screensList = document.getElementById('screensList');
    const screenCountBadge = document.getElementById('screenCountBadge');

    let currentProject = '';

    // Notify extension host on startup
    vscode.postMessage({ type: 'load-initial' });

    // Project Dropdown Change
    projectSelect.addEventListener('click', () => {});
    projectSelect.addEventListener('change', () => {
      currentProject = projectSelect.value;
      vscode.postMessage({ type: 'select-project', name: currentProject });
    });

    // Create New Project (@newproject)
    createProjectBtn.addEventListener('click', () => {
      const name = newProjectInput.value.trim();
      if (name) {
        vscode.postMessage({ type: 'create-project', name });
        newProjectInput.value = '';
      }
    });

    // Save Local Theme Config
    saveConfigBtn.addEventListener('click', () => {
      if (!currentProject) return;
      vscode.postMessage({
        type: 'save-local-config',
        name: currentProject,
        config: {
          primaryColor: primaryColor.value,
          secondaryColor: secondaryColor.value,
          primaryFont: primaryFont.value,
          appBrief: appBrief.value
        }
      });
    });

    // Handle incoming messages from Extension TS Host
    window.addEventListener('message', event => {
      const msg = event.data;
      if (msg.type === 'update-projects') {
        projectSelect.innerHTML = '';
        msg.projects.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.name;
          opt.textContent = p.name + ' (' + p.screenCount + ' screens)';
          if (p.name === msg.activeProject) opt.selected = true;
          projectSelect.appendChild(opt);
        });
        currentProject = msg.activeProject;
      } 
      else if (msg.type === 'update-project-details') {
        currentProject = msg.projectName;

        if (msg.config.primaryColor) primaryColor.value = msg.config.primaryColor;
        if (msg.config.secondaryColor) secondaryColor.value = msg.config.secondaryColor;
        if (msg.config.primaryFont) primaryFont.value = msg.config.primaryFont;
        if (msg.config.appBrief) appBrief.value = msg.config.appBrief;

        screensList.innerHTML = '';
        const screens = msg.screens || [];
        screenCountBadge.textContent = screens.length + ' Screens';

        if (screens.length === 0) {
          screensList.innerHTML = '<div style="opacity: 0.6; text-align: center; padding: 12px;">No screens in screens/</div>';
        } else {
          screens.forEach(screen => {
            const relPath = currentProject + '/screens/' + screen;
            const item = document.createElement('div');
            item.className = 'screen-item';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'screen-name';
            nameSpan.textContent = screen;

            const playBtn = document.createElement('button');
            playBtn.className = 'play-btn';
            playBtn.title = 'Execute ' + screen + ' on Figma Canvas';
            playBtn.textContent = '▶';
            playBtn.onclick = () => {
              vscode.postMessage({ type: 'execute-screen', scriptPath: relPath });
            };

            item.appendChild(nameSpan);
            item.appendChild(playBtn);
            screensList.appendChild(item);
          });
        }
      }
    });
  </script>
</body>
</html>`;
  }
}
