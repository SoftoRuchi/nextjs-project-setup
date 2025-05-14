"use client";

import React, { useEffect } from "react";
import { Tabs, List, Card, Form, Input, Button, Upload, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchRepresentatives } from "../store/slices/representativesSlice";
import { fetchLocations } from "../store/slices/locationsSlice";
import { fetchUsers } from "../store/slices/usersSlice";
import { fetchPosts } from "../store/slices/postsSlice";
import { fetchAnnouncements } from "../store/slices/announcementsSlice";
import axios from "axios";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  const representatives = useSelector((state: RootState) => state.representatives.representatives);
  const locations = useSelector((state: RootState) => state.locations.locations);
  const users = useSelector((state: RootState) => state.users.users);
  const posts = useSelector((state: RootState) => state.posts.posts);
  const announcements = useSelector((state: RootState) => state.announcements.announcements);

  useEffect(() => {
    dispatch(fetchRepresentatives());
    dispatch(fetchLocations());
    dispatch(fetchUsers());
    dispatch(fetchPosts());
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const [issueForm] = Form.useForm();
  const [postForm] = Form.useForm();

  const onIssueFinish = async (values: any) => {
    try {
      await axios.post('/api/issues', values);
      message.success('Issue submitted successfully');
      issueForm.resetFields();
    } catch (error) {
      message.error('Failed to submit issue');
    }
  };

  const onPostFinish = async (values: any) => {
    try {
      await axios.post('/api/posts', values);
      message.success('Post submitted successfully');
      postForm.resetFields();
    } catch (error) {
      message.error('Failed to submit post');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Government Representatives Portal</h1>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Representatives" key="1">
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={representatives}
            renderItem={rep => (
              <List.Item>
                <Card title={rep.name}>
                  <p><strong>Responsibilities:</strong> {rep.responsibilities}</p>
                  <p><strong>Location:</strong> {rep.location?.name}</p>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Raise Issue/Complaint" key="2">
          <Form form={issueForm} layout="vertical" onFinish={onIssueFinish}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="userId" label="Your Name" rules={[{ required: true }]}>
              <Select placeholder="Select your name">
                {users.map(user => (
                  <Option key={user.id} value={user.id}>{user.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="representativeId" label="Responsible Representative" rules={[{ required: true }]}>
              <Select placeholder="Select representative">
                {representatives.map(rep => (
                  <Option key={rep.id} value={rep.id}>{rep.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit Issue</Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Post Activity" key="3">
          <Form form={postForm} layout="vertical" onFinish={onPostFinish}>
            <Form.Item name="content" label="Content">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="imageUrl" label="Image URL">
              <Input />
            </Form.Item>
            <Form.Item name="userId" label="Your Name" rules={[{ required: true }]}>
              <Select placeholder="Select your name">
                {users.map(user => (
                  <Option key={user.id} value={user.id}>{user.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit Post</Button>
            </Form.Item>
          </Form>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={posts}
            renderItem={post => (
              <List.Item>
                <Card title={`Post by ${post.user?.name}`}>
                  <p>{post.content}</p>
                  {post.imageUrl && <img src={post.imageUrl} alt="Post image" style={{ maxWidth: '100%' }} />}
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Announcements" key="4">
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={announcements}
            renderItem={ann => (
              <List.Item>
                <Card title={ann.title}>
                  <p>{ann.content}</p>
                  <p><strong>By:</strong> {ann.representative?.name}</p>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
