node {
    stage '检出最新代码'
    git([credentialsId: 'dcac7e1f-181c-4449-bdc9-f8ff2cf892cd', url: 'https://github.com/qixinyun/skynetcredit-index-html', branch: 'master'])
    echo 'checkout success'
    stage '发布候选版本'
    //
    sh 'sudo docker login --username=skynetcredit --password=LC4qJLm9zAEyrdJq --email=41893204@qq.com registry-internal.cn-hangzhou.aliyuncs.com'
    sh 'sudo docker pull registry-internal.cn-hangzhou.aliyuncs.com/qixinyun/skynetcredit-index-html'
    sh 'sudo docker tag $(sudo docker images |grep \'registry-internal.cn-hangzhou.aliyuncs.com/qixinyun/skynetcredit-index-html\'|grep \'latest\'|awk \'{print $3}\') registry-internal.cn-hangzhou.aliyuncs.com/qixinyun/skynetcredit-index-html:$(cat ./VERSION)'
    sh 'sudo docker push registry-internal.cn-hangzhou.aliyuncs.com/qixinyun/skynetcredit-index-html:$(cat ./VERSION)'
    stage '部署沙箱'
    sh 'sed -i "s/VERSION/$(cat VERSION)/g" deployment/sandbox/docker-compose.yml'
    dir('deployment/sandbox') {
        sh 'rancher-compose --url ${RANCHER_URL} --access-key ${RANCHER_SANDBOX_ACCESS_KEY} --secret-key ${RANCHER_SANDBOX_SECRET_KEY} --verbose -p skynetcredit-index-html up -d --upgrade --confirm-upgrade service'
    }
    echo 'release sandbox success'
    //stage '部署生产'
    //sh 'sed -i "s/VERSION/$(cat VERSION)/g" deployment/sandbox/docker-compose.yml'
    //timeout(time:2, unit:'DAYS') {
    //    input message:'Release Production ?', ok: 'Release'
    //}
    //echo 'release production success'
}