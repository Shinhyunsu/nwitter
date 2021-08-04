import { dbService, storageService } from "fbase";
import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


const Nweet = ({nweetObj, isOwner}) => {
    //[itme, value] value 함수형 프로그램으로 가능d
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async () =>{
        const ok = window.confirm("Are you sure want to delete this?");
        
        if(ok){
            //delete must
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) =>{
        event.preventDefault();
        
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text:newNweet,
        });
        setEditing(false);
        
    };
    const onChange = (event) =>{
        //event.target.value === 아래와 같음 
        const {
            target: {value},
        } = event;
        setNewNweet(value);
        
    };
    //onSubmit : form전송을 하기 전에 입력된 데이터의 유효성을 체크하기 위해 사용하는 이벤트.
    //input : <input> 태그의 value 속성은 <input> 요소의 초깃값(value)을 명시합니다.
    return(
        <div className="nweet">
            {
                editing ? (
                    <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input type="text" placeholder="Edit your nweet" value={newNweet} required onChange={onChange}/>
                        <input type="submit" value="Update Nweet" className="formBtn"/>
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                    </>
                    ) : (
                    <>
                        <h4>{nweetObj.text}</h4>
                        {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
                        {isOwner && (
                            <div className="nweet__actions">
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                                
                            </div>
                        )}
                    </>
                )
            }
        </div>
    )
}

export default Nweet;