

# MCP Gemini Design

**Gemini is your frontend developer.** For all UI/design work, use this MCP. Tool descriptions contain all necessary instructions.

## Before writing any UI code, ask yourself:

- Is it a NEW visual component (popup, card, section, etc.)? → `snippet_frontend` or `create_frontend`
- Is it a REDESIGN of an existing element? → `modify_frontend`
- Is it just text/logic, or a trivial change? → Do it yourself

## Critical rules:

1. **If UI already exists and you need to redesign/restyle it** → use `modify_frontend`, NOT snippet_frontend.

2. **Tasks can be mixed** (logic + UI). Mentally separate them. Do the logic yourself, delegate the UI to Gemini.
