pipeline {
    agent any
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