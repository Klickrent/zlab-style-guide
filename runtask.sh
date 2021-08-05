#!/usr/bin/env bash

docker_build="zlab-style-guide-build"
bold=$(tput bold)
normal=$(tput sgr0)

build() {
    docker-compose run --name $docker_build --rm $docker_build sh -c "yarn build"
}

copy_font_folder() {
    docker-compose run --name $docker_build --rm $docker_build sh -c "yarn copy-font-folder"
}

generate_icon_font() {
    docker-compose run --name $docker_build --rm $docker_build sh -c "yarn generate-icon-font"
}

init() {
    docker-compose run --name $docker_build --rm $docker_build sh -c "yarn init"
}

watch() {
    docker-compose run --name $docker_build --rm $docker_build sh -c "yarn watch"
}

show_commands() {
    echo "Supported commands:"
    echo "${bold}init${normal} to install all package dependencies"
    echo "${bold}build${normal} to (re)build the styleguide HTML page"
    echo "${bold}watch${normal} watch the project for file changes and trigger a build"
    echo "${bold}generate:font${normal} generate zamicon font from svg images and store it an extra folder for now"
    echo "${bold}copy:font-folder${normal} to copy the font folder from source to distributable"
    echo "${bold}cli${normal} Runs the given command in the frontend build container"
}

if [[ $# = 0 ]]
then
    show_commands
    exit;
fi

case $1 in
    build)
        build
    ;;

    init)
        init
    ;;

    watch)
        watch
    ;;

    copy:font-folder)
        copy_font_folder
    ;;

    generate:font)
        generate_icon_font
    ;;

    cli)
        shift; docker-compose run --name $docker_build --rm $docker_build "$@"
    ;;

    help)
        show_commands
    ;;

    *)
        echo "Unknown command ${bold}$1${normal}"
        show_commands
        exit;
    ;;
esac
