pipeline {
    agent { docker 'node:10.13.0' }
    stages {
        stage('build') {
            steps {
                nodejs(nodeJSInstallationName: 'v10.13.0') {
                  sh 'npm -version'
                }
            }
        }
    }
}