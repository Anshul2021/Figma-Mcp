import * as vscode from 'vscode';
import { ProjectManager } from './projectManager';
import { FigmaAiWebviewProvider } from './webviewProvider';

export function activate(context: vscode.ExtensionContext) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceFolder) {
    console.warn('[Figma AI Extension] No open workspace found.');
    return;
  }

  const projectManager = new ProjectManager(workspaceFolder);
  const webviewProvider = new FigmaAiWebviewProvider(context.extensionUri, projectManager);

  // Register Webview View Provider in Sidebar
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'figmaAiControlPanelView',
      webviewProvider
    )
  );

  // Register File System Watcher: Auto-sync extension GUI when local/ or screens/ change externally
  const watcher = vscode.workspace.createFileSystemWatcher('**/FigmaPlugin/**');
  
  watcher.onDidChange(() => webviewProvider.refreshAll());
  watcher.onDidCreate(() => webviewProvider.refreshAll());
  watcher.onDidDelete(() => webviewProvider.refreshAll());

  context.subscriptions.push(watcher);

  // Register Extension Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('figmaAi.refreshProjects', () => {
      webviewProvider.refreshAll();
      vscode.window.showInformationMessage('Refreshed Figma AI projects & screens!');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('figmaAi.createNewProject', async () => {
      const name = await vscode.window.showInputBox({
        prompt: 'Enter new project name (@newproject)',
        placeHolder: 'e.g. ECommerceApp, SaaSDashboard'
      });
      if (name) {
        const success = projectManager.scaffoldProject(name);
        if (success) {
          vscode.window.showInformationMessage(`Scaffolded project: FigmaPlugin/${name}/`);
          webviewProvider.refreshAll(name);
        }
      }
    })
  );

  console.log('[Figma AI Extension] Activated successfully.');
}

export function deactivate() {}
