import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AnnouncementDetail = () => {
    const { announcementId } = useParams();  
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios.get(`${baseURL}/announcement/${announcementId}`)
            .then(response => {
                setAnnouncement(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching announcement details:', error);
                setLoading(false);
            });
    }, [announcementId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!announcement) {
        return <div>Announcement not found</div>;
    }

    return (
        <div className="announcement-detail">
            <h1>{announcement.name}</h1>
            <p><strong>Description:</strong> {announcement.description}</p>
            <div>
                <strong>Rich Description:</strong>
                <p>{announcement.richDescription}</p>
            </div>
            {announcement.image && <img src={announcement.image} alt="announcement" />}
            
            <div>
                <strong>Category:</strong> {announcement.announcementCategory.name}
            </div>

            <div>
                <strong>Tags:</strong>
                {announcement.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>

            <div>
                <strong>Comments:</strong>
                <ul>
                    {announcement.comments.map(comment => (
                        <li key={comment._id}>
                            <p>{comment.text}</p>
                            <p><strong>By:</strong> {comment.user.name}</p>
                            <p><em>{new Date(comment.dateCreated).toLocaleString()}</em></p>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <strong>Liked by:</strong>
                {announcement.likedBy.map(user => (
                    <span key={user._id} className="liked-by">{user.name}</span>
                ))}
            </div>

            {announcement.videos.length > 0 && (
                <div>
                    <strong>Videos:</strong>
                    {announcement.videos.map((video, index) => (
                        <video key={index} controls>
                            <source src={video} type="video/mp4" />
                        </video>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnnouncementDetail;
