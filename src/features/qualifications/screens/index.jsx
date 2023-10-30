import { Route, Routes } from 'react-router-dom';
import Qualifications from './Qualifications';
import QualificationsProfessor from './QualificationsProfessor';

export const QualificationsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Qualifications />} />
            <Route path="/courses/:courseID" element={<QualificationsProfessor />} />
        </Routes>
    )
}
