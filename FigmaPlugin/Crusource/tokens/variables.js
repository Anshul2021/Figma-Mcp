// Generated Figma Script: Crusource Enterprise Design Tokens & Native Variables Publisher
// Project: Crusource
// File: Crusource/tokens/variables.js
// Compliance: Native Figma Variables API (v1.2), Instrument Sans, Crusource Orange (#FF7700), Full Color & Typography Scale.

(async function(figma) {
  try {
    let PRIMARY_FONT = "Instrument Sans";
    try {
      await figma.loadFontAsync({ family: "Instrument Sans", style: "Bold" });
      await figma.loadFontAsync({ family: "Instrument Sans", style: "Medium" });
      await figma.loadFontAsync({ family: "Instrument Sans", style: "Regular" });
    } catch (e) {
      PRIMARY_FONT = "Inter";
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    }

    // ── 1. Create or Get Native Variable Collection ──
    let collection = figma.variables.getLocalVariableCollections().find(c => c.name === "Crusource Design Tokens");
    if (!collection) {
      collection = figma.variables.createVariableCollection("Crusource Design Tokens");
    }
    const modeId = collection.modes[0].modeId;

    function setVar(name, type, value) {
      let v = figma.variables.getLocalVariables().find(varObj => varObj.name === name);
      if (!v) {
        v = figma.variables.createVariable(name, collection.id, type);
      }
      v.setValueForMode(modeId, value);
      return v;
    }

    // ── 2. Publish Color Tokens ──
    // Brand Colors
    setVar("Colors/Brand/Primary", "COLOR", { r: 1.000, g: 0.467, b: 0.000 });       // #FF7700 Crusource Orange
    setVar("Colors/Brand/PrimaryLight", "COLOR", { r: 1.000, g: 0.941, b: 0.902 });  // #FFF0E6 Soft Orange Tint
    setVar("Colors/Brand/PrimaryDark", "COLOR", { r: 0.878, g: 0.408, b: 0.000 });   // #E06800 Orange Dark

    // Neutral Slate Scale
    setVar("Colors/Text/Head", "COLOR", { r: 0.059, g: 0.090, b: 0.165 });       // #0F172A Slate 900
    setVar("Colors/Text/Body", "COLOR", { r: 0.200, g: 0.255, b: 0.333 });       // #334155 Slate 700
    setVar("Colors/Text/Muted", "COLOR", { r: 0.392, g: 0.455, b: 0.545 });      // #64748B Slate 500
    setVar("Colors/Text/Disabled", "COLOR", { r: 0.596, g: 0.639, b: 0.702 });   // #94A3B8 Slate 400
    setVar("Colors/Surface/Background", "COLOR", { r: 0.973, g: 0.980, b: 0.988 });// #F8FAFC Slate 50
    setVar("Colors/Surface/Card", "COLOR", { r: 1.000, g: 1.000, b: 1.000 });        // #FFFFFF Pure White
    setVar("Colors/Border/Default", "COLOR", { r: 0.898, g: 0.906, b: 0.922 });    // #E5E7EB Slate 200
    setVar("Colors/Border/Light", "COLOR", { r: 0.945, g: 0.961, b: 0.976 });      // #F1F5F9 Slate 100

    // Semantic Status Colors
    setVar("Colors/Semantic/Success", "COLOR", { r: 0.063, g: 0.725, b: 0.451 });   // #10B981 Emerald
    setVar("Colors/Semantic/SuccessSoft", "COLOR", { r: 0.902, g: 0.980, b: 0.941 });// #E6FAF0 Emerald Soft
    setVar("Colors/Semantic/Warning", "COLOR", { r: 0.961, g: 0.620, b: 0.043 });   // #F59E0B Amber
    setVar("Colors/Semantic/WarningSoft", "COLOR", { r: 0.996, g: 0.953, b: 0.780 });// #FEF3C7 Amber Soft
    setVar("Colors/Semantic/Danger", "COLOR", { r: 0.937, g: 0.267, b: 0.267 });    // #EF4444 Red
    setVar("Colors/Semantic/DangerSoft", "COLOR", { r: 0.996, g: 0.886, b: 0.886 }); // #FEE2E2 Red Soft
    setVar("Colors/Semantic/Info", "COLOR", { r: 0.231, g: 0.510, b: 0.965 });      // #3B82F6 Blue
    setVar("Colors/Semantic/InfoSoft", "COLOR", { r: 0.937, g: 0.965, b: 1.000 });   // #EFF6FF Blue Soft

    // ── 3. Publish Float Tokens (Radii & Spacing) ──
    setVar("Radii/xs", "FLOAT", 4);
    setVar("Radii/sm", "FLOAT", 6);
    setVar("Radii/md", "FLOAT", 8);
    setVar("Radii/lg", "FLOAT", 12);
    setVar("Radii/xl", "FLOAT", 16);
    setVar("Radii/full", "FLOAT", 999);

    setVar("Spacing/4", "FLOAT", 4);
    setVar("Spacing/8", "FLOAT", 8);
    setVar("Spacing/12", "FLOAT", 12);
    setVar("Spacing/16", "FLOAT", 16);
    setVar("Spacing/20", "FLOAT", 20);
    setVar("Spacing/24", "FLOAT", 24);
    setVar("Spacing/32", "FLOAT", 32);

    // ── 4. Publish Local Text Styles ──
    async function setTextStyle(name, fontSize, fontStyle = "Regular") {
      try {
        let style = figma.getLocalTextStyles().find(s => s.name === name);
        if (!style) {
          style = figma.createTextStyle();
        }
        style.name = name;
        style.fontName = { family: PRIMARY_FONT, style };
        style.fontSize = fontSize;
      } catch (err) {
        console.warn(`Text style notice: ${name}`);
      }
    }

    await setTextStyle("Typography/Display 32", 32, "Bold");
    await setTextStyle("Typography/Title 24", 24, "Bold");
    await setTextStyle("Typography/Header 20", 20, "Bold");
    await setTextStyle("Typography/Subhead 16 Bold", 16, "Bold");
    await setTextStyle("Typography/Subhead 16 Medium", 16, "Medium");
    await setTextStyle("Typography/Body 14 Regular", 14, "Regular");
    await setTextStyle("Typography/Body 14 Medium", 14, "Medium");
    await setTextStyle("Typography/Body 14 Bold", 14, "Bold");
    await setTextStyle("Typography/Caption 12 Regular", 12, "Regular");
    await setTextStyle("Typography/Caption 12 Medium", 12, "Medium");
    await setTextStyle("Typography/Caption 12 Bold", 12, "Bold");
    await setTextStyle("Typography/Micro 10 Bold", 10, "Bold");

    figma.notify("Published Crusource Tokens, Native Variables & Typography Styles!", { timeout: 2500 });
  } catch (err) {
    console.error("Variable publishing error:", err);
  }
})(figma);
