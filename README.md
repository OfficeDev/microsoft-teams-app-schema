--- 
page_type: sample 
products: 
- office-teams
- office-365 
languages: 
- json
description: JSON Schema used to provision Apps for Microsoft Teams
extensions: 
  contentType: samples 
  technologies: 
  - Add-ins 
  createdDate: 6/28/2018 10:26:10 AM 
---

# Microsoft Teams App Schema

This repository is where the [JSON Schema](http://json-schema.org/) for the [Microsoft Teams application manifest](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema) resides. The first line in a Teams app manifest.json file is a reference to this file so that it can be validated, e.g.: `"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.9/MicrosoftTeams.schema.json",`.

If you are localizing your Microsoft Teams app, then you should also use the localization schema in your strings file to ensure a proper format, e.g.: `"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.9/MicrosoftTeams.Localization.schema.json",`.

Unless you are writing an app that reads/writes Microsoft Teams manifest.json files, you don't need to care about this.

# Versioning

If you do want to link to MicrosoftTeams.schema.json within your source, here's where to find specific versions.
* **Released version.** https://developer.microsoft.com/en-us/json-schemas/teams/vX.X/MicrosoftTeams.schema.json (the GitHub repository for which is [here](https://github.com/Microsoft/json-schemas)), where X.X corresponds to 
the version numbers listed in the [releases](https://github.com/OfficeDev/microsoft-teams-app-schema/releases); usually [Latest release](https://github.com/OfficeDev/microsoft-teams-app-schema/releases/latest). 
* **Developer Preview.** The [preview/DevPreview branch](https://github.com/OfficeDev/microsoft-teams-app-schema/tree/preview/DevPreview) contains the manifest matching features in [Microsoft Teams Developer Preview](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/dev-preview/developer-preview-features). If you need to link to this version, you can use this URL: <https://raw.githubusercontent.com/OfficeDev/microsoft-teams-app-schema/preview/DevPreview/MicrosoftTeams.schema.json>.

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
