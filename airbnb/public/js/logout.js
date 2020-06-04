
const logout = async() => {
    try{
        console.log('clicked')
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout',
        })
        if (res.data.status === 'success') location.reload(true)
    }catch(err){
        alert('Try Again')
    }
}

document.querySelector('.logout').addEventListener('click',logout)