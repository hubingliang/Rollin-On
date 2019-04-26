pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                nodejs(nodeJSInstallationName: 'v10.13.0') {
                  sh 'npm install -g @vue/cli-service-global'
                  sh 'npm install axios'
                  sh 'npm install'
                  sh 'npm run build'
                }
            }
        }
    }
}