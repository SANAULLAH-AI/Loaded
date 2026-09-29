cmake_minimum_required(VERSION 3.20)
project(lightningclean VERSION 1.3.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

# Automated discovery lookup parameters tracking pybind11 local prefixes
execute_process(
    COMMAND python3 -c "import pybind11; print(pybind11.get_cmake_dir())"
    OUTPUT_VARIABLE PYBIND11_CMAKE_DIR
    OUTPUT_STRIP_TRAILING_WHITESPACE
)

list(APPEND CMAKE_PREFIX_PATH "${PYBIND11_CMAKE_DIR}")
find_package(pybind11 REQUIRED)

add_library(_core MODULE src/core.cpp)
set_target_properties(_core PROPERTIES PREFIX "")
set_target_properties(_core PROPERTIES SUFFIX ".so")

# Feature #2: Explicit native micro-architecture optimization assembly flags mapping
target_compile_options(_core PRIVATE -O3 -mavx2 -march=native -pthread)
target_link_libraries(_core PRIVATE pybind11::module numa)

install(TARGETS _core DESTINATION .)
