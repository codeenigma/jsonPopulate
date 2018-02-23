<?php

namespace JsonPopulate;

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\SessionCookieJar;
use GuzzleHttp\Exception\ClientException;

/**
 * Generates the content of the iframe pane.
 */
class Frame implements BodyInterface {

  /**
   *
   * @var string
   * Url to retrieve.
   */
  protected $source;

  /**
   *
   * @var array
   * The current 'page' in use.
   */
  protected $current;

  /**
   *
   * @var Symfony\Component\HttpFoundation\Request
   */
  protected $request;

  /**
   * Headers "safe" to pass from client.
   *
   * @var array
   */
  protected $headers = [
    'HTTP_USER_AGENT' => 'User-Agent',
    'HTTP_ACCEPT' => 'Accept',
    'HTTP_ACCEPT_LANGUAGE' => 'Accept-Language',
    'HTTP_ACCEPT_ENCODING' => 'Accept-Encoding',
    'HTTP_DNT' => 'DNT',
    'HTTP_CONNECTION' => 'Connection',
    'HTTP_UPGRADE_INSECURE_REQUESTS' => 'Upgrade-Insecure-Requests',
  ];

  /**
   *
   */
  public function __construct(\Symfony\Component\HttpFoundation\Request $request, $current, $config) {
    $this->request = $request;
    $this->current = $current;
    $this->setSource();
  }

  /**
   *
   */
  protected function setSource() {
    // Default base path.
    $this->source = $this->current['url'];
    if (empty($this->request->query->get('page'))) {
      return;
    }
    $page = $this->request->query->get('page');
    // Absolute URL. We pass without further checks.
    foreach (['http://', 'https://', '//'] as $scheme) {
      if (strpos($page, $scheme) === 0) {
        $this->source = $page;
        return;
      }
    }
    $base = $this->current['scheme'] . '://' . $this->current['host'];
    $this->source = $base . $page;
  }

  /**
   *
   */
  public function getBody() {
    $body = $this->getContent();
    return $this->prepareBody($body);
  }

  /**
   *
   */
  protected function getContent() {
    // Fake headers to try not to be blocked by
    // security checks.
    $headers = [];
    foreach ($this->headers as $param => $header) {
      if (isset($_SERVER[$param])) {
        $headers[$header] = $_SERVER[$param];
      }
    }
    $cookie_jar = new SessionCookieJar($this->current['id'], TRUE);
    $options = [
      'headers' => $headers,
      'cookies' => $cookie_jar,
    ];
    $client = new Client();
    try {
      $request = $client->request('GET', $this->source, $options);
      $content = $request->getBody();
    }
    catch (ClientException $e) {
      $content = $e->getMessage();
    }
    return $content;
  }

  /**
   *
   */
  protected function prepareBody($body) {

    // Silently discard parsing errors.
    libxml_use_internal_errors(TRUE);
    $dom = new \DOMDocument();
    $dom->preserveWhiteSpace = TRUE;
    $dom->loadHTML($body);
    // Iterate through images and links.
    $elements = [
      'a' => 'href',
      'img' => 'src',
      'script' => 'src',
      'link' => 'href',
    ];
    foreach ($elements as $tag => $attr) {
      $items = $dom->getElementsByTagName($tag);
      foreach ($items as $item) {
        // Replace relative url to full absolute links.
        if ($item->hasAttribute($attr)) {
          $url = $this->normalizeUrl($item->getAttribute($attr));
          $item->setAttribute($attr, $url);
        }
      }
    }

    return $dom->saveHtml();
  }

  /**
   *
   */
  protected function replaceDomain($body) {
    $host = $this->current['host'];
    $base = $this->current['scheme'] . '://' . $host;
    $port = $this->current['port'];
    if (!empty($port) && !in_array($port, array(80, 443))) {
      $base .= ':' . $port;
    }
    $body = str_replace($base, '', $body);
    return $body;
  }

  /**
   *
   */
  protected function normalizeUrl($url) {
    $host = $this->current['host'];
    $base = $this->current['scheme'] . '://' . $host;
    $port = $this->current['port'];
    if (!empty($port) && !in_array($port, array(80, 443))) {
      $base .= ':' . $port;
    }
    $url_parts = parse_url($url);
    // Is it a relative link (URI)?
    if (empty($url_parts['host'])) {
      return $base . $url;
    }
    return $url;
  }

}
