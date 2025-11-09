#!/usr/bin/env python3
"""
VaultHive Development Server Starter
Starts both backend and frontend development servers
"""

import os
import sys
import subprocess
import time
import signal
import threading
from pathlib import Path

class VaultHiveStarter:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.root_dir = Path(__file__).parent
        self.backend_dir = self.root_dir / "backend"
        self.frontend_dir = self.root_dir / "frontend"
        
    def check_requirements(self):
        """Check if all required files and dependencies exist"""
        print("🔍 Checking requirements...")
        
        # Check if backend directory exists
        if not self.backend_dir.exists():
            print("❌ Backend directory not found!")
            return False
            
        # Check if frontend directory exists
        if not self.frontend_dir.exists():
            print("❌ Frontend directory not found!")
            return False
            
        # Check if Python requirements.txt exists
        requirements_file = self.backend_dir / "requirements.txt"
        if not requirements_file.exists():
            print("⚠️  requirements.txt not found, creating basic version...")
            self.create_requirements_file()
            
        # Check if .env file exists
        env_file = self.root_dir / ".env"
        if not env_file.exists():
            print("⚠️  .env file not found, creating from template...")
            self.create_env_file()
            
        print("✅ Requirements check completed")
        return True
        
    def create_requirements_file(self):
        """Create basic requirements.txt file"""
        requirements_content = """flask==2.3.3
flask-cors==4.0.0
supabase==1.0.4
python-dotenv==1.0.0
requests==2.31.0
werkzeug==2.3.7
"""
        requirements_file = self.backend_dir / "requirements.txt"
        requirements_file.write_text(requirements_content)
        print("📝 Created requirements.txt file")
        
    def create_env_file(self):
        """Create basic .env file from template"""
        env_content = """# VaultHive Environment Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SECRET_KEY=dev-secret-key-change-in-production
FLASK_ENV=development
FLASK_DEBUG=True
MONAD_TESTNET_RPC_URL=https://testnet1.monad.xyz/
PRIVATE_KEY=your_private_key_without_0x_prefix
"""
        env_file = self.root_dir / ".env"
        env_file.write_text(env_content)
        print("📝 Created .env file - please update with your configuration")
        
    def install_backend_deps(self):
        """Install Python backend dependencies"""
        print("📦 Installing Python dependencies...")
        try:
            subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", 
                str(self.backend_dir / "requirements.txt")
            ], check=True, cwd=str(self.backend_dir))
            print("✅ Python dependencies installed")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install Python dependencies: {e}")
            return False
            
    def install_frontend_deps(self):
        """Install Node.js frontend dependencies"""
        package_json = self.root_dir / "package.json"
        if not package_json.exists():
            print("⚠️  package.json not found, skipping npm install")
            return True
            
        print("📦 Installing Node.js dependencies...")
        try:
            subprocess.run(["npm", "install"], check=True, cwd=str(self.root_dir))
            print("✅ Node.js dependencies installed")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install Node.js dependencies: {e}")
            return False
        except FileNotFoundError:
            print("⚠️  npm not found, skipping Node.js dependencies")
            return True
            
    def start_backend(self):
        """Start Flask backend server"""
        print("🚀 Starting Flask backend server...")
        try:
            self.backend_process = subprocess.Popen([
                sys.executable, "app.py"
            ], cwd=str(self.backend_dir))
            print("✅ Backend server started on http://localhost:5000")
            return True
        except Exception as e:
            print(f"❌ Failed to start backend server: {e}")
            return False
            
    def start_frontend(self):
        """Start frontend development server"""
        print("🚀 Starting frontend server...")
        try:
            # Try to use Python's built-in server
            self.frontend_process = subprocess.Popen([
                sys.executable, "-m", "http.server", "3000"
            ], cwd=str(self.frontend_dir))
            print("✅ Frontend server started on http://localhost:3000")
            return True
        except Exception as e:
            print(f"❌ Failed to start frontend server: {e}")
            return False
            
    def stop_servers(self):
        """Stop all running servers"""
        print("\n🛑 Stopping servers...")
        
        if self.backend_process:
            self.backend_process.terminate()
            try:
                self.backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.backend_process.kill()
            print("🛑 Backend server stopped")
            
        if self.frontend_process:
            self.frontend_process.terminate()
            try:
                self.frontend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.frontend_process.kill()
            print("🛑 Frontend server stopped")
            
    def signal_handler(self, signum, frame):
        """Handle Ctrl+C gracefully"""
        self.stop_servers()
        sys.exit(0)
        
    def run(self):
        """Main execution function"""
        print("🏦 VaultHive Development Server Starter")
        print("=" * 50)
        
        # Set up signal handler for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
        # Check requirements
        if not self.check_requirements():
            return False
            
        # Install dependencies
        if not self.install_backend_deps():
            return False
            
        if not self.install_frontend_deps():
            print("⚠️  Continuing without Node.js dependencies...")
            
        # Start servers
        if not self.start_backend():
            return False
            
        # Give backend time to start
        time.sleep(2)
        
        if not self.start_frontend():
            return False
            
        print("\n🎉 VaultHive development environment is ready!")
        print("📱 Frontend: http://localhost:3000")
        print("🔧 Backend:  http://localhost:5000")
        print("📋 API Docs: http://localhost:5000/api/health")
        print("\nPress Ctrl+C to stop all servers")
        
        try:
            # Keep the script running
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop_servers()

if __name__ == "__main__":
    starter = VaultHiveStarter()
    starter.run()
