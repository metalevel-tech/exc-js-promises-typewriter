# Command-line

Here is a list of my custom scrips, commands and procedures, related to the app deployment.

## Reverse proxy for the app

```bash
sudo a2proxy 'typewriter' '48021'
```

```bash
sudo a2proxy 'typewriter' remove
```

## Docker container for the app

```bash
docker-compose up -d
```

```bash
docker-compose down
```

```bash
docker-prune.sh
```

## [PM2](https://www.npmjs.com/package/pm2) service for the app

```bash
pm2 start 'npm run watch' --name 'typewriter'
pm2 save
```

```bash
pm2 start 'npm start' --name 'typewriter'
pm2 save
```

```bash
pm2 stop 'typewriter'
pm2 delete 'typewriter'
pm2 save
```
