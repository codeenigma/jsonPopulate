<?php

/**
 * @file
 * Standalone index file for JsonPopulate.
 */

use Symfony\Component\HttpFoundation\Request;
use JsonPopulate\Dispatch;

/**
 * Path to the various components.
 */
define('ROOT_DIR', realpath(__DIR__ . '/..'));
// Depending on standalone or dependency install,
// vendor dir can be in one of those location.
if (is_dir(ROOT_DIR . '/../../../vendor')) {
  define('VENDOR_DIR', realpath(ROOT_DIR . '/../../../vendor'));
}
if (is_dir(ROOT_DIR . '/vendor')) {
  define('VENDOR_DIR', ROOT_DIR . '/vendor');
}
define('TEMPLATE_DIR', ROOT_DIR . '/templates');
define('WEB_DIR', ROOT_DIR . '/www');
define('CONFIG_FILE', 'jsonpopulate.yml');
define('EXAMPLE_CONFIG_FILE', ROOT_DIR . '/' . CONFIG_FILE . '.example');
define('TEMP_DIR', sys_get_temp_dir() . '/jsonPopulate/' . $_SERVER['SERVER_NAME']);

// Autoload.
require VENDOR_DIR . '/autoload.php';
// Request handling through Symfony.
$request = Request::createFromGlobals();
$dispatch = new Dispatch($request);
$dispatch->process();
