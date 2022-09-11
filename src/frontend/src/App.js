//import logo from './logo.svg';
//import {Button, Radio} from 'antd';
import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button,
    Badge,
    Tag,
    Avatar,
    Radio,
    Popconfirm,
    Image,
    Divider
} from 'antd';
import { useState, useEffect} from 'react';
import React from 'react';
import {deleteStudent, getAllStudent} from "./client";
import './App.css';
//import type { MenuProps } from 'antd';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined, PlusOutlined
} from '@ant-design/icons';

import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";

const { Header, Content, Footer, Sider } = Layout;
const TheAvatar = ({name}) => {
    let trim = name.trim();
    if(trim.length === 0) {
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split = trim.split(" ");
    if(split.length === 1) {
        return <Avatar>{name.charAt((0))}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length - 1)}`}</Avatar>
}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student with ${studentId} was deleted`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "there was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}

const columns = fetchStudents =>[
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        //dataIndex: '',
        key: 'actions',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                    <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudent()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
                //setFetching(false);
            }).catch(err => {
                console.log(err.response)
            err.response.json().then(res => {
                console.log(res);
                errorNotification("There was an issue",
                    `${res.message} [statusCode:${res.status}] [${res.error}]`
                )
            });
        }).finally(() => setFetching(false))

    useEffect(()=> {
        console.log("component is mounted");
        fetchStudents();
    }, []);
    // if(students.length <= 0) {
    //     return <>
    //         {/*<Button*/}
    //         {/*    onClick={() => setShowDrawer(!showDrawer)}*/}
    //         {/*    type="primary" shape="round" icon={<PlusOutlined/>} size="small">*/}
    //         {/*    Add new Student*/}
    //         {/*</Button>*/}
    //         {/*<StudentDrawerForm*/}
    //         {/*    showDrawer={showDrawer}*/}
    //         {/*    setShowDrawer={setShowDrawer}*/}
    //         {/*    fetchStudents={fetchStudents}*/}
    //         {/*/>*/}
    //         <Empty />;
    //     </>
    // }

    const renderStudents = () => {
        if(fetching) {
            return <Spin indicator = {antIcon} />
        }
        if(students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add new Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                    />
                <Empty />;
            </>


        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
        <Table
            dataSource={students}
            columns={columns(fetchStudents)}
            bordered
            title = {() =>
                <>
                    <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    size="small">
                    Add New Student
                </Button>
                    <Tag style={{marginLeft:"10px"}}>Number of student</Tag>
                    <Badge count={students.length} className="site-badge-count-4"/>
                </>
                    }
            pagination={{ pageSize: 50 }}
            scroll={{ y: 400 }}
            rowKey={(students) => students.id}
        />;
        </>
    }

    return <Layout
        style={{
            minHeight: '100vh',
        }}
    >
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout className="site-layout">
            <Header
                className="site-layout-background"
                style={{
                    padding: 0,
                }}
            />
            <Content
                style={{
                    margin: '0 16px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 360,
                    }}
                >
                    {renderStudents()}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                <Image width={75}
                    src="https://user-images.githubusercontent.com/99449776/189012262-f2085cc0-9adf-4749-9d67-97a1f5657688.jpeg"
                />
                <Divider>
                    {/*<a href="">link</a>*/}
                </Divider>
            </Footer>
        </Layout>
    </Layout>

}

export default App;
