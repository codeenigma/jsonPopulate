<?php

namespace JsonPopulate;

/**
 *
 */
class Edit implements BodyInterface {

  protected $id;
  protected $path;
  protected $request;
  protected $pages;

  /**
   * Absolute path to the twig cache directory to use.
   *
   * @var string
   */
  protected $twigCacheDir;

  /**
   * Twig environment instance.
   *
   * @var \Twig_Environment
   */
  protected $twig;

  /**
   * Debug mode.
   *
   * @var Bool
   */
  protected $debug;

  /**
   *
   */
  public function __construct(\Symfony\Component\HttpFoundation\Request $request, $current, $config) {
    $this->debug = !empty($config['debug']);
    $this->twigCacheDir = TEMP_DIR . '/twig';
    if ($this->debug) {
      // Quick and dirty way of disabling Twig cache.
      $this->twigCacheDir = TEMP_DIR . '/' . time();
    }
    $this->request = $request;
    $this->id = $current['id'];
    $this->root = $config['root'];
    $this->path = $current['source'];
    $this->parent = $current['parent'];
    $this->pages = $config['pages'];
    $this->initTwigEngine();
  }

  /**
   * Initialize the Twig environment.
   */
  protected function initTwigEngine() {
    // Load Twig rendering.
    $twigParams = [
      'cache' => $this->twigCacheDir,
      'debug' => $this->debug,
    ];
    $templates = [
      TEMPLATE_DIR,
    ];
    $loader = new \Twig_Loader_Filesystem($templates);
    $this->twig = new \Twig_Environment($loader, $twigParams);
    if ($this->debug) {
      $this->twig->addExtension(new \Twig_Extension_Debug());
      $this->twig->enableDebug();
    }
  }

  /**
   *
   */
  public function getBody() {
    // Return the form in any case.
    $twig = $this->twig;
    $render_vars = [
      'form' => $this->getForm(),
      'current_id' => $this->id,
      'current_path' => $this->parent . '/' . $this->id,
      'pages' => $this->getPages(),
    ];
    $body = $twig->render('html.html.twig', $render_vars);
    return $body;
  }

  /**
   *
   */
  protected function getPages() {
    $sorted = [];
    foreach ($this->pages as $page) {
      $sorted[$page['parent']]['below'][$page['id']] = $page;
      $sorted[$page['parent']]['id'] = $page['parent'];
    }
    return $sorted;
  }

  /**
   *
   */
  protected function getForm() {
    $data = json_decode(file_get_contents($this->path));
    return $this->processData($data);
  }

  /**
   *
   */
  protected function processData($data, $parent = '') {
    $items = [];
    foreach ($data as $property => $value) {
      //@todo fix names/ids to be failproof.
      $key = $property;
      if (!empty($parent)) {
        $key = $parent . '[' . $property . ']';
      }
      $id = trim(str_replace(array('[', ']'), '-', $key), '-');
      $items[$key]['id'] = $id;
      $items[$key]['label'] = $property;
      if (is_object($value) || is_array($value)) {
        $items[$key]['children'] = $this->processData($value, $key);
      }
      else {
        $items[$key]['value'] = $value;
      }
    }
    return $items;
  }

}
