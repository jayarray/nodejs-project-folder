let Path = require('path');

//-----------------------------

class PathBuilder {
  constructor() {
    this.rootDir = Path.resolve('.');
    this.parts = [];
  }

  /**
   * Changes the root directory from being the root project folder (top most folder) to being the current project's folder (closest project parent folder).
   * Call this function if you are going to build a path for items in the current project and NOT the root project. (Avoids being affected when nested inside another project).
   */
  currentProjectAsRoot() {
    let currentDir = __dirname;
    let parentDir = Path.dirname(currentDir);
    let parentName = parentDir.split(Path.sep).pop();

    if (parentName == 'node_modules') {
      grandParentDir = Path.dirname(parentDir);
      this.rootDir = grandParentDir;
    }

    return this;
  }

  /**
   * Appends the directory name, file name, or partial path to the current path being built.
   * @param {string} str Directory name, file name, or partial path.
   */
  append(str) {
    if (str.includes(Path.sep)) {
      let parts = str.split(Path.sep);

      parts.forEach(p => {
        if (p)
          this.parts.push(p);
      });
    }
    else
      this.parts.push(str);

    return this;
  }

  /**
   * @returns {string} Returns the relative path.
   */
  relativePath() {
    return this.parts.join(Path.sep);
  }

  /**
   * @returns {string} Returns the full path.
   */
  fullPath() {
    let rootParts = this.rootDir.split(Path.sep);
    let pathParts = this.parts;
    let combinedParts = rootParts.concat(pathParts);
    let path = combinedParts.join(Path.sep);

    return path;
  }
}

exports.PathBuilder = PathBuilder;

//-----------------------------------

/**
 * Load the module at the specified relative path.
 * @param {string} relPath The relative path to the file in the root project.
 * @returns {object} Returns the respective module properties similar to using 'require'. Returns null if path does not exist or there is an error loading the module.
 */
exports.Load = (relPath) => {
  let pathBuilder = new PathBuilder();

  let relParts = relPath.split(Path.sep);
  relParts.forEach(part => pathBuilder.append(part));

  let fullPath = pathBuilder.fullPath();

  try {
    let x = require(fullPath);
    return x;
  }
  catch (error) {
    return null;
  }
}