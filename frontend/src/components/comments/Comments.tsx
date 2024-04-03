import React, { useState } from 'react';
import {  Button, Textarea, Card, Pagination, Flex, Center, Group, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CommentData } from '../../utils/Types';

interface CommentsProps {
    Comments: CommentData[]
}

function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
      return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
  }

const Comments: React.FC<CommentsProps> = ({Comments}) => {
    const form = useForm({
        initialValues: {
          commentText: ''
        },
      });

      const [activePage, setPage] = useState(1);
      const paginatedComments = chunk(Comments, 2); 
      const items = paginatedComments[activePage - 1] ? paginatedComments[activePage - 1].map((item, index) => (
        <Card key={index} m={"10px"} w={"20rem"}>
            <Card.Section>
                <Group justify={"center"} mt={"sm"} >
                    <Text>From: {item.username}</Text>
                    <Text>At: {`${new Date(item.date).getDate()}/${new Date(item.date).getMonth() + 1}/${new Date(item.date).getFullYear()}`}</Text>
                </Group>
            </Card.Section>
            <Card.Section>
                <p>{item.commentText}</p>
            </Card.Section>
        </Card>
      )) : [];

    const PostComment = async (values: any) => {

    }
    
    
    return (
        <>
        <Flex justify={Center} direction={"column"}>
        {items}
        <Pagination total={paginatedComments.length} value={activePage} onChange={setPage} m="sm" />
        <br />
            <form onSubmit={form.onSubmit((values) => PostComment(values))}>
                <Textarea  w={"20rem"}  autosize minRows={1} maxRows={4}
                    label="Add a comment:"
                    placeholder="Write a comment..." 
                    {...form.getInputProps('commentText')}
                />
            <Button size="md" type="submit" m={"10px"}> Post </Button>
            </form>
        </Flex>
        </>
    );
};

export default Comments;