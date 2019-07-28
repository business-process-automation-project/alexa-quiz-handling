# alexa-quiz-handling
### Benötigte Accounts und Tools
aws Account erstellen: https://portal.aws.amazon.com/billing/signup#/start

Amazon Developer Account erstellen: https://developer.amazon.com/

**AWS CLI** </br>
wird verwendet während des Skill Deployment verwendet </br>
AWS CLI in der Kommandozeile installieren: </br>
`pip install awscli --upgrade --user` </br> weitere für mehr Details unter: https://docs.aws.amazon.com/de_de/cli/latest/userguide/cli-chap-install.html </br>
CLI konfigurieren: </br>
`$ aws configure` </br>
`AWS Access Key ID [None]: <Your_Access_Key>`</br>
`AWS Secret Access Key [None]: <Your_Secret_Access_Key>`</br>
`Default region name [None]: eu-west-2`</br>
`Default output format [None]: json`</br>

**ASK CLI** </br>
wird für die Entwicklung und Deployment eines Skills verwendet</br>
für mehr Details unter: https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html </br>
ASK CLI in der Kommandozeile installieren: </br>
`$ npm install -g ask-cli` </br>
CLI konfigurieren: </br>
`$ ask init` </br>
`? Please create a new profile or overwrite the existing profile.` </br>
`Create new profile` </br>
`? Please type in your new profile name:` </br>
`default` </br>
`-------------------- Initialize CLI --------------------` </br>
`Setting up ask profile: [default]` </br>
`? Please choose one from the following AWS profiles for skill's Lambda function deployment.` </br>
`alexa-dev` </br>
Ein Browser Fenster öffnet sich. Mit dem Amazon Account einloggen.

**Skill Deployment** </br>
Node-Module installieren: `cd lambda/custom; npm install` </br>
Skill und Lambda Code auf AWS deployen: `ask deploy`
