pipeline {
    agent { docker 'node:10.13.0' }
    stages {
        stage('build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}