<?php

namespace JsonPopulate;

use Symfony\Component\HttpFoundation\Response;
use JsonPopulate\ConfigManager;

/**
 * Generates an archive of a ready to use skeleton.
 */
class Dispatch {

  protected $request;
  protected $frame;
  protected $config;
  protected $current;

  /**
   *
   */
  public function __construct(\Symfony\Component\HttpFoundation\Request $request) {
    $this->request = $request;
    $this->config = $this->getConfig();
  }

  /**
   *
   */
  protected function setCurrent() {
    $current = $this->request->query->get('id');
    foreach ($this->config['pages'] as $source => $page) {
      if (empty($current) || $current === $page['id']) {
        $this->current = $page;
        $components = parse_url($this->current['url']);
        $this->current['host'] = $components['host'];
        $this->current['scheme'] = $components['scheme'];
        $this->current['port'] = !empty($components['port']) ? $components['port'] : 0;
        return;
      }
    }
  }

  /**
   *
   */
  protected function getConfig() {
    $configManager = new ConfigManager($this->request);
    return $configManager->getConfig();
  }

  /**
   *
   */
  protected function isFrame() {
    return !empty($this->request->query->get('src'));
  }

  /**
   *
   */
  protected function isSubmit() {
    return ($this->request->getMethod() === 'POST');
  }

  /**
   *
   */
  public function process() {
    $this->setCurrent();
    $body = $this->getBody();
    $response = new Response();
    $response->setContent($body);
    $response->prepare($this->request);
    return $response->send();
  }

  /**
   *
   */
  protected function getBody() {
    If ($this->isSubmit()) {
      return $this->getSubmitBody();
    }
    if ($this->isFrame()) {
      return $this->getFrameBody();
    }
    return $this->getFormBody();
  }

  /**
   *
   */
  protected function getFormBody() {
    $processor = new Edit($this->request, $this->current, $this->config);
    return $processor->getBody();
  }

  /**
   *
   */
  protected function getFrameBody() {
    $processor = new Frame($this->request, $this->current, $this->config);
    return $processor->getBody();
  }

  /**
   *
   */
  protected function getSubmitBody() {
    $processor = new Save($this->request, $this->current, $this->config);
    return $processor->getBody();
  }

}
