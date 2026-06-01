<?php

header('Content-Type: application/json; charset=utf-8');

class SchoolSubject {
    private $name;
    private $teacher;
    private $description;
    private $group;
    private $credits;

    public function __construct($name, $teacher, $description, $group, $credits) {
        $this->name = trim($name);
        $this->teacher = trim($teacher);
        $this->description = trim($description);
        $this->group = trim($group);
        $this->credits = $credits;
    }

    public function getName() { 
        return $this->name; 
    }

    public function getTeacher() { 
        return $this->teacher; 
    }

    public function getDescription() { 
        return $this->description; 
    }

    public function getGroup() { 
        return $this->group; 
    }

    public function getCredits() { 
        return $this->credits; 
    }
}

class SchoolSubjectValidator {
    private static array $validGroups = ['М', 'ПМ', 'ОКН', 'ЯКН'];

    public static function validate(SchoolSubject $subject): array {
        $errors = [];

        if (empty($subject->getName())) {
            $errors['name'] = 'Името на учебния предмет е задължително поле';
        } else {
             $len = mb_strlen($subject->getName(), 'UTF-8');
            if ($len < 2) {
                $errors['name'] = "Името на учебния предмет трябва да е с дължина поне 2 символа, а вие сте въвели {$len}";
            } elseif ($len > 150) {
                $errors['name'] = "Името на учебния предмет трябва да е с дължина най-много 150 символа, а вие сте въвели {$len}";
            }
        }

        if (empty($subject->getTeacher())) {
            $errors['teacher'] = 'Името на учителя е задължително поле';
        } else {
            $len = mb_strlen($subject->getTeacher(), 'UTF-8');
            if ($len < 3) {
                $errors['teacher'] = "Името на учителя трябва да е с дължина поне 3 символа, а вие сте въвели {$len}";
            } elseif ($len > 200) {
                $errors['teacher'] = "Името на учителя трябва да е с дължина най-много 200 символа, а вие сте въвели {$len}";
            }
        }

        if (empty($subject->getDescription())) {
            $errors['description'] = 'Описанието е задължително поле';
        } else {
            $len = mb_strlen($subject->getDescription(), 'UTF-8');
            if ($len < 10) {
                $errors['description'] = "Описанието трябва да е с дължина поне 10 символа, а вие сте въвели {$len}";
            }
        }

        if (empty($subject->getGroup())) {
            $errors['group'] = 'Групата е задължително поле, изберете една от М, ПМ, ОКН и ЯКН';
        } else {
            if (!in_array($subject->getGroup(), self::$validGroups, true)) {
                $errors['group'] = 'Невалидна група, изберете една от М, ПМ, ОКН и ЯКН';
            }
        }

        if (empty($subject->getCredits())) {
            $errors['credits'] = 'Кредитите са задължително поле';
        } else {
            if (!is_numeric($credits) || (int)$credits != $credits || (int)$credits <= 0) {
                $errors['credits'] = 'Кредитите трябва да са цяло положително число';
            }
        }

        return $errors;
    }
}


if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $inputData = json_decode(file_get_contents('php://input'), true);

     if (json_last_error() === JSON_ERROR_NONE && is_array($inputData)) {
        $name        = $inputData['name']        ?? '';
        $teacher     = $inputData['teacher']     ?? '';
        $description = $inputData['description'] ?? '';
        $group       = $inputData['group']        ?? '';
        $credits     = $inputData['credits']      ?? '';
    } else {
        $name        = $_POST['name']        ?? '';
        $teacher     = $_POST['teacher']     ?? '';
        $description = $_POST['description'] ?? '';
        $group       = $_POST['group']        ?? '';
        $credits     = $_POST['credits']      ?? '';
    }

    $subject = new SchoolSubject($name, $teacher, $description, $group, $credits);

    $errors = SchoolSubjectValidator::validate($subject);

    if (empty($errors)) {
        echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(
            ['success' => false, 'errors' => $errors],
            JSON_UNESCAPED_UNICODE
        );
    }

} else {
    exit;
}
?>