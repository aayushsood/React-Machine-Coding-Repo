import { useRef, useEffect , useState, useCallback} from "react";
import "./InfiniteScroll.css"

interface IResultObject{
    id:number;
    gender?:string;
    image?:string;
    name?:string;
    species?:string;
    status?:string;
}

interface IInfo{
count:number;
next:string;
pages:number;
}
interface IResponse{
    info:IInfo;
    results:IResultObject[]
}


const InfiniteScroll:React.FC = ()=>{
    const lastDiv = useRef<HTMLDivElement>(null);

    const [pageNumber, setPageNumber] = useState<number>(1);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [results, setResults] = useState<IResultObject[]>([]);
    const [loading,setLoading] = useState(false);
    const isFetching = useRef(false);
    const [isError, setIsError] = useState(false);


const fetchRickAndMorty = useCallback(async ():Promise<void> =>{
    if(isFetching.current) return;
    isFetching.current=true;
    setLoading(true);
try{
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${pageNumber}`);
    const finalResponse:IResponse = await response.json();
    if(!finalResponse.info.next)
    {
        setHasNext(false);
        return;
    }


    const data:IResultObject[] = finalResponse.results.map((val:IResultObject)=>({
        id:val.id,
        gender:val?.gender,
        image:val.image,
        name:val?.name,
        species: val?.species,
        status:val?.status
    }));

    setResults((prev)=>[...prev,...data]);
}catch(err){
    setIsError(true);
}finally{
    isFetching.current=false;
    setLoading(false);
}
}
,[pageNumber]) 




useEffect(()=>{


const callback = (entries:IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
    if (entry.isIntersecting&& !isFetching.current) {
      setPageNumber((num)=>num+1);
    }
  });
};

const intersectionObserver = new IntersectionObserver(callback,{
    threshold:0.5
});


    if (lastDiv.current) {
      intersectionObserver.observe(lastDiv.current);
    }
    fetchRickAndMorty();

    return ()=> intersectionObserver.disconnect();
},[]);



useEffect(()=>{
    if(pageNumber===1) return;
    fetchRickAndMorty();
},[pageNumber])





    return<>
    <h2 className="heading" >Please Scroll to Load More Characters</h2>

    <div className="bodyCss">
        {results.map((val:IResultObject)=><div key={val.id}  style={{ width:"50%"}}>
            <div className="card">
            
            <img   className="imageCss"  src={val.image} />
            <div >
            <div className="cardText">
            <h5>Name: {val.name}</h5>
            <h5>Gender: {val.gender}</h5>
            <h5>Species: {val.species}</h5>
            <h5>Alive or Dead: {val.status}</h5>
            </div>
            </div>
            </div>
        </div>
    )}
    {loading&&<h3 className="loader">Loading more characters... please wait</h3>}
    </div>
    {!hasNext&&!isError&&!loading&&<h3 className="loader">You have reached the end of list !!</h3>}
    {isError&&!loading&&<h3 style={{color:"red", backgroundColor:"#fffff"}}>Something went wrong</h3>}
    <div ref={lastDiv}></div>
    </> 
}

export default InfiniteScroll;