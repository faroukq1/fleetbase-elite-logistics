<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Sets the application locale from the `X-Locale` header sent by the
 * console (see services/fetch.js), so server-generated content that
 * depends on `app()->getLocale()` — currently just spreadsheet export
 * column headings, via `__()` lookups in the vendor Export classes —
 * matches whatever language the user has the console set to. This is
 * independent of the browser's `Accept-Language` header, which reflects
 * OS/browser settings rather than the in-app language toggle.
 */
class SetLocaleFromHeader
{
    /**
     * Locales the console actually offers (see console/app/services/language.js
     * SUPPORTED_LOCALES) — anything else is ignored and the app falls back to
     * its configured default locale.
     *
     * @var array<int, string>
     */
    protected $supportedLocales = ['en', 'ar'];

    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('X-Locale');

        if ($locale) {
            // Console locales are like `en-us` / `ar-ae`; translation files
            // are keyed by the base language.
            $locale = strtolower(substr($locale, 0, 2));

            if (in_array($locale, $this->supportedLocales, true)) {
                app()->setLocale($locale);
            }
        }

        return $next($request);
    }
}
