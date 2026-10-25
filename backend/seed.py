import sys
from services.indexer import index_repository

# usage: npm run seed            (chhota sample repo)
#        npm run seed -- https://github.com/owner/repo
URL = sys.argv[1] if len(sys.argv) > 1 else "https://github.com/pallets/itsdangerous"

repo = index_repository(URL, print)
print(f"Indexed {repo['name']}: {repo['files']} files, {repo['chunks']} chunks")
