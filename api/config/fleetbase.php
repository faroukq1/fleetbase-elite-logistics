<?php

return [
    'api' => [
        'version' => 'v1',
        'routing' => [
            'prefix' => '',
            'internal_prefix' => 'int'
        ]
    ],
    'console' => [
        'path' => '/fleetbase/console',
        'host' => 'localhost',
        'subdomain' => null,
        'secure' => false
    ],
    'services' => [
        'ipinfo' => [
            'api_key' => null
        ]
    ],
    'connection' => [
        'db' => 'mysql',
        'sandbox' => 'sandbox'
    ],
    'branding' => [
        'logo_url' => '/images/elite_green.jpeg',
        'icon_url' => '/images/icon.png'
    ],
    'version' => '0.7.1',
    'instance_id' => null,
    'sms_auth_bypass_code' => null,
    'user_cache' => [
        'enabled' => true,
        'server_ttl' => 900,
        'browser_ttl' => 300,
    ]
];
