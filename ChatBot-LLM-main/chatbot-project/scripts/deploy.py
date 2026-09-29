"""
Deployment helper script for Hugging Face Spaces & Cloud Run.
Usage: python scripts/deploy.py --target huggingface --space-name sanaullah7964/sanaullah-llm-chatbot
"""

import argparse
import os
import shutil
import subprocess

def deploy_huggingface(space_name: str, token: str = None):
    print(f"🤗 Preparing deployment to Hugging Face Space: {space_name}...")
    
    deploy_dir = "./hf_space_export"
    if os.path.exists(deploy_dir):
        shutil.rmtree(deploy_dir)
    os.makedirs(deploy_dir)

    # Copy necessary deployment assets
    shutil.copy("app/ui.py", os.path.join(deploy_dir, "app.py"))
    shutil.copy("requirements.txt", os.path.join(deploy_dir, "requirements.txt"))
    shutil.copy("README.md", os.path.join(deploy_dir, "README.md"))

    print(f"📦 Assets prepared in {deploy_dir}/")
    print(f"To push to Hugging Face Spaces:")
    print(f"  cd {deploy_dir}")
    print(f"  git init && git remote add space https://huggingface.co/spaces/{space_name}")
    print(f"  git add . && git commit -m 'Deploy Sanaullah Fine-Tuned Chatbot' && git push -u space main")

def main():
    parser = argparse.ArgumentParser(description="Deploy Sanaullah LLM Chatbot")
    parser.add_argument("--target", type=str, default="huggingface", choices=["huggingface", "local"])
    parser.add_argument("--space-name", type=str, default="sanaullah7964/sanaullah-llm-chatbot")
    args = parser.parse_args()

    if args.target == "huggingface":
        deploy_huggingface(args.space_name)
    else:
        print("🖥️ Starting local deployment...")
        subprocess.run(["python", "app/ui.py"])

if __name__ == "__main__":
    main()
