# CCS - Claude Code Switch

Ultra-simple wrapper for `claude --settings`. Switch between Claude profiles with friendly aliases.

## Why?

Claude CLI supports `--settings` flag but it's verbose:

```bash
claude --settings ~/.claude/glm.settings.json
claude --settings ~/.claude/sonnet.settings.json --verbose
```

CCS makes it friendly:

```bash
ccs glm
ccs sonnet --verbose
```

## Installation

```bash
git clone https://github.com/kaitranntt/ccs.git
cd ccs
./install.sh
```

Or as a one-liner:

```bash
git clone https://github.com/kaitranntt/ccs.git && cd ccs && ./install.sh
```

## Configuration

Copy example config:

```bash
cp .ccs.example.json ~/.ccs.json
```

Edit `~/.ccs.json` with your profiles:

```json
{
  "profiles": {
    "glm": "~/.claude/glm.settings.json",
    "sonnet": "~/.claude/sonnet.settings.json"
  }
}
```

## Usage

### Basic

```bash
ccs glm                  # Use GLM profile
ccs sonnet               # Use Sonnet profile
```

### Pass Arguments Transparently

All arguments after the profile name are passed directly to Claude:

```bash
ccs glm --verbose
ccs sonnet /plan "add feature"
ccs opus --model claude-opus-4
```

## Requirements

- `bash` (3.2+ compatible)
- `jq` (JSON processor)
- [Claude CLI](https://docs.claude.com/en/docs/claude-code/installation) installed

### Installing jq

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Fedora
sudo dnf install jq
```

## How It Works

1. Reads profile name from first argument
2. Looks up settings file path in `~/.ccs.json`
3. Executes `claude --settings <path> [remaining-args]`

That's it. No magic, no proxies, no file modification.

## Troubleshooting

### Profile not found

```bash
Error: Profile 'foo' not found in ~/.ccs.json
```

**Solution**: Add the profile to your `~/.ccs.json` config file.

### Settings file missing

```bash
Error: Settings file not found: ~/.claude/foo.settings.json
```

**Solution**: Create the settings file or update the path in your config.

### jq not installed

```bash
Error: jq is required but not installed
```

**Solution**: Install jq using your package manager (see Requirements section).

### PATH not set

```bash
⚠️  Warning: ~/.local/bin is not in PATH
```

**Solution**: Add to your shell profile (`~/.bashrc` or `~/.zshrc`):

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Then restart your shell or run `source ~/.bashrc` (or `~/.zshrc`).

## Use Cases

### Claude Subscription + GLM Coding Plan

If you have both Claude subscription and GLM coding plan:

```json
{
  "profiles": {
    "claude": "~/.claude/sonnet.settings.json",
    "glm": "~/.claude/glm.settings.json"
  }
}
```

```bash
ccs claude           # Use Claude subscription
ccs glm              # Use GLM coding plan
```

### Multiple Anthropic Accounts

```json
{
  "profiles": {
    "work": "~/.claude/work.settings.json",
    "personal": "~/.claude/personal.settings.json"
  }
}
```

### Different Models

```json
{
  "profiles": {
    "sonnet": "~/.claude/sonnet.settings.json",
    "opus": "~/.claude/opus.settings.json",
    "haiku": "~/.claude/haiku.settings.json"
  }
}
```

## Uninstallation

```bash
rm ~/.local/bin/ccs
rm ~/.ccs.json
```

## License

MIT

## Contributing

PRs welcome! Keep it simple (KISS principle).

## Philosophy

**YAGNI**: We don't add features "just in case"
**KISS**: Simple bash script, no complexity
**DRY**: One source of truth (config file)

This tool does ONE thing well: map profile names to settings files. Nothing more.
