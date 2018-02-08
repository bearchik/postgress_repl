#!/bin/bash

su postgres -c '/usr/lib/postgresql/9.6/bin/pg_ctl start'
cron -f /var/log/cron.log & wait $!
