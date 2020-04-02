#!/bin/bash

parse() {
    while [[ $# -gt 0 ]]
    do
        IFS='=' read -r -a array <<< "$1"
        key="${array[0]}"
        value="${array[1]}"

        case $key in  
            -c|--components)
                export UWKGM_COMPONENTS="$value"
                ;;
        esac
        shift
    done
}

parse "${@}"
