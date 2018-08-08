# What Is This?

This repository is where the [JSON Schema](http://json-schema.org/) for the [Microsoft Teams application manifest](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema) resides. The first line in a Teams app manifest.json file is a reference to this file so that it can be validated, e.g.: `"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.3/MicrosoftTeams.schema.json",`.

Unless you are writing an app that reads/writes Microsoft Teams manifest.json files, you don't need to care about this.

# Versioning

If you do want to link to MicrosoftTeams.schema.json within your source, here's where to find specific versions.
* **Released version**. https://developer.microsoft.com/en-us/json-schemas/teams/vX.X/MicrosoftTeams.schema.json, where X.X corresponds to 
the version numbers listed in the [releases](https://github.com/OfficeDev/microsoft-teams-app-schema/releases); usually [Latest release](https://github.com/OfficeDev/microsoft-teams-app-schema/releases/latest).
* **Next release (vNext)**. Generally, there is no reason to link to MicrosoftTeams.schema.json in the `master` branch directly. At any point in time, the version of `MicrosoftTeams.schema.json` in the `master` branch *may* match the [Latest release](https://github.com/OfficeDev/microsoft-teams-app-schema/releases/latest) or it may be a future version that will appear in [releases](https://github.com/OfficeDev/microsoft-teams-app-schema/releases) at a later date (vNext). If you do need to link to the vNext version, you can use this URL: https://raw.githubusercontent.com/OfficeDev/microsoft-teams-app-schema/master/MicrosoftTeams.schema.json. 

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
