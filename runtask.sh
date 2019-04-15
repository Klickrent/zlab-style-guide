#!/usr/bin/env bash

docker_build="zlab-style-guide-build"
bold=$(tput bold)
normal=$(tput sgr0)

build() {
    docker-compose run --name $docker_build --rm $docker_build sh -c "npm run build"
}

watch() {
    docker-compose run --name $docker_build --rm $docker_build sh -c "npm run watch"
}

generate_icon_font() {
    docker-compose run --rm $docker_build sh -c "node svg2Font.js"
}

show_commands() {
    echo "Supported commands:"
    echo "${bold}build${normal} to (re)build the styleguide HTML page"
    echo "${bold}watch${normal} watch the project for file changes and trigger a build"
    echo "${bold}generate:font${normal} generate zamicon font from svg images and store it an extra folder for now"
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

    watch)
        watch
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
