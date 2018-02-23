<?php

namespace JsonPopulate;

use Symfony\Component\Yaml\Yaml;

/**
 * Generates an archive of a ready to use skeleton.
 */
class ConfigManager {

  protected $config;

  /**
   *
   */
  public function __construct(\Symfony\Component\HttpFoundation\Request $request) {
    $this->request = $request;
    $this->config = $this->parseConfig();
  }

  /**
   *
   */
  protected function parseConfig() {
    $configFile = $this->getConfigFilePath();
    $config = Yaml::parse(file_get_contents($configFile));
    $config['root'] = dirname($configFile);
    $config['pages'] = $this->scanPages($config);
    return $config;
  }

  public function getConfig() {
    return $this->config;
  }

  protected function getConfigFilePath() {
    $path = $this->findConfigFilePath(ROOT_DIR);
    if ($path) {
      return $path;
    }
    return EXAMPLE_CONFIG_FILE;
  }

  /**
   * Recursively search for a config files in parent folders.
   * @param string $dir
   *   Absolute path to the dir to scan.
   * @return string|NULL
   *   Absolute path to the config file.
   */
  protected function findConfigFilePath($dir) {
    if (is_dir($dir) && $handle = opendir($dir)) {
      while (FALSE !== ($filename = readdir($handle))) {
        $path = $dir . '/' . $filename;
        if ($filename === CONFIG_FILE) {
          closedir($handle);
          return $path;
        }
      }
      closedir($handle);
      // Recurse to parent, until we reach root for the second time.
      $parent = dirname($dir);
      if ($parent !== $dir) {
        return $this->findConfigFilePath($parent);
      }
    }
    return NULL;
  }

  /**
   * Recursicely populate a list of pages.
   */
  protected function scanPages($config) {
    $collection = [];
    foreach ($config['dirs'] as $source) {
      $path = realpath($config['root'] . '/' . $source['source']);
      if (is_dir($path)) {
        $dir = new \RecursiveDirectoryIterator($path);
        $iterate = new \RecursiveIteratorIterator($dir);
        $files = new \RegexIterator($iterate, '/.*\.json$/i');
        foreach ($files as $filepath) {
          $short_path = trim(str_replace($path, '', $filepath->getRealPath()), '/');
          $collection[$short_path] = [
            'url' => $source['url'],
            'source' => $filepath->getRealPath(),
            'id' => $short_path,
            'parent' => $source['source'],
          ];
        }
      }
    }

    return $collection;
  }

}
