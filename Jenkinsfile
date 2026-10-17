
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('Check Python') {
            steps {
                bat 'python --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    bat 'if not exist .venv\\Scripts\\python.exe python -m venv .venv'
                    bat '.venv\\Scripts\\python.exe -m pip install --upgrade pip'
                    bat '.venv\\Scripts\\python.exe -m pip install -r requirements.txt'
                }
            }
        }

        stage('Django System Check') {
            steps {
                dir('backend') {
                    bat '.venv\\Scripts\\python.exe manage.py check'
                }
            }
        }

        stage('Run Automated Tests') {
            steps {
                dir('backend') {
                    withCredentials([
                        string(
                            credentialsId: 'postgres-db-password',
                            variable: 'DB_PASSWORD'
                        )
                    ]) {
                        withEnv([
                            'DB_NAME=myproject_db',
                            'DB_USER=postgres',
                            'DB_HOST=127.0.0.1',
                            'DB_PORT=5432'
                        ]) {
                            bat '.venv\\Scripts\\python.exe manage.py test'
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Freelance project CI pipeline passed.'
        }
        failure {
            echo 'CI pipeline failed. Check Console Output.'
        }
    }
}
