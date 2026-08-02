FigmaPlugins/                               📁 Root Folder
│
├── plugins/                                📁
│
├── core/                                   📁 (System Rules)
│   ├── command.md                          📄
│   ├── instruction.md                      📄
│   └── autolayout.md                       📄
│
├── global/                                 📁 (Default Project Context)
│   ├── fonts.md                            📄
│   ├── colors.md                           📄
│   ├── taste.md                            📄
│   └── brief.md                            📄
│
└── <Project_Name>/                         📁 (Dynamic - User Defined)
    │
    ├── screens/                            📁
    │   ├── <Screen_Name_1>.js              📜 (Dynamic - Generated from user's screen/frame names)
    │   ├── <Screen_Name_2>.js              📜
    │   ├── <Screen_Name_3>.js              📜
    │   └── ...
    │
    └── local/                              📁 (Project Overrides)
        ├── fonts.md                        📄
        ├── colors.md                       📄
        ├── taste.md                        📄
        └── brief.md                        📄