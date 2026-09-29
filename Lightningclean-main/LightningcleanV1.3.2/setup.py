import os
import subprocess
from setuptools import setup, Extension
from setuptools.command.build_ext import build_ext

class CMakeBuildModule(build_ext):
    def run(self):
        for extension in self.extensions:
            self.compile_cmake_architecture(extension)

    def compile_cmake_architecture(self, ext):
        absolute_working_dir = os.path.abspath(os.path.dirname(__file__))
        build_temp_dir = self.build_temp
        os.makedirs(build_temp_dir, exist_ok=True)
        
        subprocess.check_call(['cmake', absolute_working_dir], cwd=build_temp_dir)
        subprocess.check_call(['cmake', '--build', '.'], cwd=build_temp_dir)
        
        compiled_so_binary = os.path.join(build_temp_dir, "_core.so")
        output_target_destination = self.get_ext_fullpath(ext.name)
        os.makedirs(os.path.dirname(output_target_destination), exist_ok=True)
        
        import shutil
        shutil.copyfile(compiled_so_binary, output_target_destination)

setup(
    name="lightningclean",
    ext_modules=[Extension("_core", sources=[])],
    cmdclass={"build_ext": CMakeBuildModule},
    package_dir={"": "python"},
    py_modules=["lightningclean"]
)
