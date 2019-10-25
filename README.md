# Zeppelin Lab GmbH Styleguide
This is the Z-Lab wide Styleguide project, to be used by all the ventures.

## Usage

Install it via npm:
```
npm install github:Klickrent/zlab-style-guide
```

## Adding new zamicons

1. create a branch from master
2. collect your svg images, one or more (please use the naming conventions: minus (-) to split the words and only lowercase letters, called **kebab-case**)
3. copy svg images (one or more) into folder: src/images/zamicons/
4. open `package.json` file and update the version number by incrementing the last number, i.e. 1.3.27, will become 1.3.28
5. open `docs/index.html`. At the end of file, in the icons section, add a `<li>` element putting the new icon in the right place (alphabetically sorted). The name of the icon has to be prefixed with `zamicon-`, e.g. `scan-asset` will become `zamicon-scan-asset`
6. run the build process: `./runtask.sh build`
7. test it (open `docs/index.html` in a browser)
8. Create a new tag in git with `git tag v1.x.x` to match the version in the package.json to indicate that the module has a new version to NPM
8. create a pull request

Some of the included icons are made by [Gregor Cresnar](https://www.flaticon.com/authors/gregor-cresnar) and [Freepik](https://www.freepik.com) - distributed via [www.flaticon.com](https://www.flaticon.com). All are available under the [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/) license.
