pipeline {
    agent any
    stages {
        stage('test') {
            steps {
                nodejs(nodeJSInstallationName: 'v10.13.0') {
                  sh 'npm -version'
                }
            }
        }
    }
}