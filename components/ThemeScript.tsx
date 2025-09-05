export function ThemeScript() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                var resolvedTheme = 'light';
                
                if (theme === 'dark') {
                  resolvedTheme = 'dark';
                } else if (theme === 'light') {
                  resolvedTheme = 'light';
                } else {
                  // Default to system or 'system' theme
                  resolvedTheme = systemTheme;
                }
                
                if (resolvedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                  // Also set a CSS variable to prevent flash
                  document.documentElement.style.setProperty('--initial-color-mode', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.setProperty('--initial-color-mode', 'light');
                }
              } catch (e) {
                // Fallback to light theme if there's any error
                document.documentElement.classList.remove('dark');
                document.documentElement.style.setProperty('--initial-color-mode', 'light');
              }
            })();
          `,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html {
              /* Prevent flash by setting initial colors before CSS loads */
              background-color: #f9fafb;
            }
            html.dark {
              background-color: #111827;
            }
            /* Prevent transition on initial load */
            .no-flash * {
              transition: none !important;
            }
          `,
        }}
      />
    </>
  )
}
