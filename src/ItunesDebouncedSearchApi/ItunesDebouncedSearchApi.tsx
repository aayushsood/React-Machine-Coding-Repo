import {useState} from 'react';
import './itunes.css'

type timeoutIdType = number|undefined;

interface IShowResults{
    artistName?:string;
    artistViewUrl?: string;
    collectionName?:string;
    country?:string;
    currency?:string;
}

interface IResults {
    resultCount?:number;
    results?:Record<any, string>[];
}



const ItunesDebouncedSearchApi = ()=>{
    const [artistResults, setArtistResults] = useState<IShowResults[]>([]);
    const [loading,setLoading] = useState<boolean>(false);

    const fetchResults = async (query:string)=>{
        try{
            const results = await fetch(`https://itunes.apple.com/search?term=${query}&limit=10`);
            let theResults:IResults = await results.json();
            const resultArray = theResults.results || [];
            const data:IShowResults[] = resultArray.map((val:Record<any, string>)=>{
                return {
                   artistName:val.artistName,
                   artistViewUrl:val.artistViewUrl,
                   collectionName:val.collectionName,
                   country:val.country,
                   currency:val.currency
                }
            })
            setArtistResults([...data]);
        }catch(err){
            console.log(err, 'something went wrong');
        }finally{
            setLoading(false);
        }

    }

    const debouncedFetch = (func:(...args:any[])=>void, delay:number=500)=>{
        let timeoutId:timeoutIdType=undefined;

        return (...args:any[])=>{

            clearTimeout(timeoutId);

            timeoutId = setTimeout(()=>{
                func(...args);
            },delay);

        }
    }


    const debouncedfetchResults = debouncedFetch(fetchResults,500);

    
    
    return <>
    <h1>Search your favorite artist, song or album</h1>
    <input
    placeholder='Search here'
    className='input_itunes'
    onChange={(e)=>{
        setLoading(true);
        debouncedfetchResults(e.target.value)
    }}
    />

    {loading&& <h4>Loading... Please wait</h4>}

    <div className='container'>
        {
            artistResults.map((val)=><div className='miniContainer'>

                <div className='inside_container'>
                    <p>Artist Name:</p> <h5>{val.artistName}</h5>
                </div>

                <div className='inside_container'>
                    <p>URL:</p> <a href={val.artistViewUrl}>{val.artistViewUrl?"Click Here":"Link Not Available"}</a>
                </div>
                
                <div className='inside_container'>
                    <p>Collection Name:</p> <h5>{val.collectionName}</h5>
                </div>
                
                <div className='inside_container'>
                    <p>Country:</p> <h5>{val.country}</h5>
                </div>
                
                <div className='inside_container'>
                    <p>Currency:</p> <h5>{val.currency}</h5>
                </div>

                
                
            </div>
            )
        }
    </div>

    </>

}

export default ItunesDebouncedSearchApi;