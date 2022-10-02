function TrialPromise(){
    return new Promise((resolve, reject)=>{
        const waktu = 1000;
        if(waktu<2000){
            setTimeout(()=>{
                resolve('Habis')
            }, waktu);
        }else{
            reject('Terlalu Lama');
        }
    });

}
async function TrialAsync(){
try{
    const trial = await TrialPromise();
    console.log(trial);
} catch (err){
    console.log(err);
}
}
TrialAsync();