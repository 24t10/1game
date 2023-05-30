import {useEffect, useState} from "react";
import {getTopicsAll, getTopicsAndPrepare} from "@/controllers/forum-controller";
import ForumTopicItem from "@/features/forum/components/forum-topic-item";
import {ITopic} from "@/api/types";
import {MockTopics} from "@/mock/mockTopics";
import {useDispatch, useSelector} from "react-redux";
import {ForumActions, ForumSelectors} from "@/store/slices/forum-slice";

/**
 Компонент форума cо списком Топиков
 @category component
 */
const ForumTopicList = () => {

    const dispatch = useDispatch();
    const list = useSelector(ForumSelectors.all);
    console.log('list of topics in forum-topic-list = ', list)

    useEffect(() => {
        dispatch(ForumActions.setForumDataFromServerToStore);
    }, []);

    return (
        <ul className="">
            {list.map(( data : any, index: number) => (
                <ForumTopicItem key={index} topic_id={data.topic_id} user={data.user} subject={data.subject} user_id={data.user_id} comment_id={data.comment_id} id={data.id} created_at={data.created_at} comments={data.comments} updated_at={data.updated_at}/>
            ))}
        </ul>
    );
};

export default ForumTopicList;