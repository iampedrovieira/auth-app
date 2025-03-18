Build the docker image

docker build -t typescript-dev-env-2025

Setup/run a docker container dev env

docker run -it -p 3000:3000 -v .:/usr/src/app typescript-dev-env-2025 bash

Open bash when container is already running
docker exec -it typescript-dev-env-2025 /bin/bash  

Permissions inside object

delete - object
read - read all info
add - add permissions/user
remove - remove permissions
update - update object info

TODO
    
    - Finalizar DB
        
    - Clean
      
        - Usar variaveis de ambiente
            - Usar env de deployment, prod e test
            - Nos de test user varavens com docker e githubactions
     
    - Create unit test to
        - objetct handler
        - singup handler
        - middlwares
            - on functions 
        - utils folder
    - Create e2e test
        - Create full test to api(with middwlare)
        - Mockar a db e fazer o pedido via axios
    - Create a "quality env" (check if is a common/good pratice)
        - Will have run test without mocks
        - Have a seeds db and a app runnig
        - The tests running/made request to this api
    
    - Criar login com o spotify
    
    - Criar pipeline de deploy
    Ver se é possivel fazer as pipelines de graça



