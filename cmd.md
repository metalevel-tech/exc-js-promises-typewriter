# These are my custom scrips, commands and procedures

```bash
sudo a2proxy 'typewriter' '48001'
```

```bash
docker-compose up -d
```

```bash
docker-compose down
```

```bash
docker-prune.sh
```

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

```bash
sudo a2proxy 'typewriter' remove
```
