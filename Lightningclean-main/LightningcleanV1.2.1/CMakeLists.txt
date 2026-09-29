cmake_minimum_required(VERSION 3.18)
project(lightningclean VERSION 1.2.1 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Apply high-velocity compiler speed flags
if(MSVC)
    add_compile_options(/O2 /W4 /openmp)
else()
    add_compile_options(-O3 -Wall -fopenmp)
    
    # Dynamic compiler optimization path mapping
    execute_process(COMMAND uname -m OUTPUT_VARIABLE CPU_ARCH OUTPUT_STRIP_TRAILING_WHITESPACE)
    if(CPU_ARCH MATCHES "x86_64")
        add_compile_options(-mavx2 -mfma)
    elseif(CPU_ARCH MATCHES "arm" OR CPU_ARCH MATCHES "aarch64")
        add_compile_options(-march=native)
    endif()
endif()

# Locate internal Python and pybind11 modules
find_package(pybind11 CONFIG REQUIRED)

# Setup hardware matrix library module
pybind11_add_module(lightningclean_core src/bindings.cpp)

# Link OpenMP safely across core segments
find_package(OpenMP REQUIRED)
target_link_libraries(lightningclean_core PRIVATE OpenMP::OpenMP_CXX)

# Direct build artifact output placement straight inside the target directory wrapper
set_target_properties(lightningclean_core PROPERTIES
    OUTPUT_NAME "lightningclean_core"
    PREFIX ""
    SUFFIX "${PYTHON_MODULE_EXTENSION}"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/lightningclean"
)

install(TARGETS lightningclean_core DESTINATION lightningclean)
