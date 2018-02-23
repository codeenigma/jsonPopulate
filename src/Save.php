<?php

namespace JsonPopulate;

/**
 *
 */
class Save implements BodyInterface {

  protected $data;
  protected $path;
  protected $request;
  protected $pages;

  /**
   *
   */
  public function __construct(\Symfony\Component\HttpFoundation\Request $request, $current, $config) {
    $this->request = $request;
    $this->path = $current['source'];
    $this->data = $this->request->request->all();
  }

  /**
   *
   */
  public function getBody() {
    return json_encode($this->save());
  }

  protected function save() {
    //@todo return proper code (200/500) instead.
    $data = json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);
    try {
      file_put_contents($this->path, $data);
      return 'OK';
    }
    catch (Exception $e) {
      return $e->getMessage();
    }
  }

}
