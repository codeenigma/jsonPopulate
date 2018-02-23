<?php

namespace JsonPopulate;

/**
 * Generates an archive of a ready to use skeleton.
 */
interface BodyInterface {

  /**
   *
   */
  public function __construct(\Symfony\Component\HttpFoundation\Request $request, $current, $config);

  /**
   *
   */
  public function getBody();
}
