# Apache2 Virtual Host Conf

Here is a minimal ReverseProxy configuration for Apache2.

```bash
cat /etc/apache2/sites-available/typewriter.metalevel.tech.conf
```

```apacheconf
Define base_fqdn metalevel.tech
Define typewriter_fqdn typewriter.metalevel.tech
Define typewriter_srvr 127.0.0.1
Define typewriter_port 48003

<VirtualHost *:80>
    ServerName ${typewriter_fqdn}
    ServerAdmin admin@${base_fqdn}

    ErrorLog ${APACHE_LOG_DIR}/${typewriter_fqdn}.error.log
    CustomLog ${APACHE_LOG_DIR}/${typewriter_fqdn}.access.log combined

    # Redirect Requests to HTTPS
    Redirect permanent "/" "https://${typewriter_fqdn}/"
</VirtualHost>

<IfModule mod_ssl.c>
<VirtualHost _default_:443>
    ServerName ${typewriter_fqdn}
    ServerAdmin admin@${base_fqdn}

    ErrorLog ${APACHE_LOG_DIR}/${typewriter_fqdn}.error.log
    CustomLog ${APACHE_LOG_DIR}/${typewriter_fqdn}.access.log combined

    <IfModule http2_module>
        Protocols h2 h2c http/1.1
        H2Upgrade on

        H2Push on
        H2PushPriority *                       after
        H2PushPriority text/css                before
        H2PushPriority image/jpg               after 32
        H2PushPriority image/jpeg              after 32
        H2PushPriority image/png               after 32
        H2PushPriority application/javascript  interleaved

        # From apache2/mods-available/http2.conf
        # Since mod_http2 doesn't support the mod_logio module (which provide the %O format),
        # you may want to change your LogFormat directive as follow:
        LogFormat "%v:%p %h %l %u %t \"%r\" %>s %B \"%{Referer}i\" \"%{User-Agent}i\"" vhost_combined
        LogFormat "%h %l %u %t \"%r\" %>s %B \"%{Referer}i\" \"%{User-Agent}i\"" combined
        LogFormat "%h %l %u %t \"%r\" %>s %B" common
    </IfModule>

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/${base_fqdn}/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/${base_fqdn}/privkey.pem
    Include /etc/apache2/mods-available/ssl.conf
    Include /etc/letsencrypt/options-ssl-apache.conf

    <Location "/">
        ProxyPass "http://${typewriter_srvr}:${typewriter_port}/"
        ProxyPassReverse "http://${typewriter_srvr}:${typewriter_port}/"
    </Location>

    <Location "/api/">
        ProxyPass "http://api.icndb.com:80/"
        ProxyPassReverse "http://api.icndb.com:80/"
    </Location>
</VirtualHost>
</IfModule>
```